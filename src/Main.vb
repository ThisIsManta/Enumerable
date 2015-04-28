Module Main

  Dim Marks As String() = {"(", ")", "{", "}", "[", "]", "<", ">", "=", "+", "-", "*", "/", "&", "|", ",", ";", ":"}

  Sub Main()
		Dim Input As New StreamReader("..\src\Enumerable.js", True)

    Dim DebugBuffer As New StringBuilder
    Dim CompressedBuffer As New StringBuilder
    Dim PreviousLineHasDeclaration As Boolean = False
    Dim FirstContiguousComment As Boolean = True
    Do Until Input.EndOfStream
      Dim Line As String = Input.ReadLine
      DebugBuffer.AppendLine(Line)
      Line = Line.Trim

      If Line.Length > 0 Then
        If Line.StartsWith("//") Then
          If FirstContiguousComment Then
            CompressedBuffer.AppendLine(Line)
          End If

        Else
          FirstContiguousComment = False

          If Line.Contains("Enumerable") Then
            Dim Occurences As New List(Of Integer)
            For i As Integer = 0 To Line.Length - 1
              Dim j As Integer = Line.IndexOf("Enumerable", i)
              If j >= 0 Then
                Occurences.Add(j)
                i = j + 9
              Else
                Exit For
              End If
            Next
            Occurences.Reverse()
            For Each Occurence In Occurences
              Dim ToBeReplaced As Boolean = True
              For Each Replacement In New String() {"function ", "new ", "instanceof ", "'", """"}
                If Occurence >= Replacement.Length AndAlso Line.Substring(Occurence - Replacement.Length, Replacement.Length) = Replacement Then
                  ToBeReplaced = False
                  Exit For
                End If
              Next
              If ToBeReplaced Then
                Line = Line.Substring(0, Occurence) & "_" & Line.Substring(Occurence + 10)
              End If
            Next
          End If

          Dim CurrentLineHasDeclaration As Boolean = Line.StartsWith("var ") AndAlso Line.EndsWith(";")
          If PreviousLineHasDeclaration AndAlso CurrentLineHasDeclaration Then
            Line = "," & Line.Substring(4, Line.Length - 4)
            CompressedBuffer.Remove(CompressedBuffer.Length - 1, 1)
          End If

          CompressedBuffer.Append(Line.Chars(0))
          For i As Integer = 1 To Line.Length - 1
            Dim c As Char = Line.Chars(i)
            If Marks.Contains(c) Then
              If Char.IsWhiteSpace(CompressedBuffer.Chars(CompressedBuffer.Length - 1)) Then
                CompressedBuffer.Remove(CompressedBuffer.Length - 1, 1)
              End If
            End If
            If Not Char.IsWhiteSpace(c) OrElse i = 0 OrElse Not Marks.Contains(Line.Chars(i - 1)) Then
              CompressedBuffer.Append(c)
            End If
          Next

          PreviousLineHasDeclaration = CurrentLineHasDeclaration
        End If
      End If
    Loop

    Using Output As New StreamWriter("Enumerable-amd.js", False, System.Text.Encoding.ASCII)
      Output.WriteLine(DebugBuffer)
      Output.WriteLine("module.exports = window.top.Enumerable = window.Enumerable = Enumerable;")
    End Using

		Using Output As New StreamWriter("Enumerable-min.js", False, System.Text.Encoding.ASCII)
			Output.Write(CompressedBuffer)
			Output.Write("var Enumerable=_;")
		End Using

    Using Output As New StreamWriter("Main.html", False, System.Text.Encoding.ASCII)
      Output.WriteLine("<!DOCTYPE html>")
      Output.WriteLine("<html lang=""en"" xmlns=""http://www.w3.org/1999/xhtml"">")
      Output.WriteLine("<head>")
      Output.WriteLine("<meta charset=""utf-8"" />")
      Output.WriteLine("<title></title>")
      If System.Environment.GetCommandLineArgs.Contains("-debug") Then
        Output.WriteLine("<script type=""text/javascript"" src=""Enumerable.js""></script>")
      Else
				Output.WriteLine("<script type=""text/javascript"" src=""Enumerable-min.js""></script>")
      End If
      Output.WriteLine("<script type=""text/javascript"" src=""Test.js""></script>")
      Output.WriteLine("</head>")
			Output.WriteLine("<body>")
			Output.WriteLine("<script type=""text/javascript"">console.log('Test.run();'); Test.run();</script>")
      Output.WriteLine("</body>")
      Output.WriteLine("</html>")
    End Using

    Process.Start("chrome", "Main.html")
  End Sub

End Module
